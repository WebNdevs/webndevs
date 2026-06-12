<?php

namespace App\Services;

use App\Models\Service;
use App\Models\ServiceTemplateField;
use App\Models\ServiceTemplateValue;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class ServiceTemplateSyncService
{
    public function snapshot(Service $service): array
    {
        $service->loadMissing(['templateFields', 'templateValues.field']);

        return [
            'service' => [
                'id' => $service->id,
                'name' => $service->name,
                'slug' => $service->slug,
            ],
            'fields' => $service->templateFields
                ->sortBy(fn (ServiceTemplateField $field) => [$field->display_order, $field->id])
                ->values(),
            'values' => $service->templateValues
                ->map(fn (ServiceTemplateValue $value) => [
                    'id' => $value->id,
                    'field_key' => $value->field?->field_key,
                    'service_plan_id' => $value->service_plan_id,
                    'value' => $value->value,
                ])
                ->filter(fn (array $value) => filled($value['field_key']))
                ->values(),
        ];
    }

    public function sync(Service $service, array $fields, array $values, ?User $actor): array
    {
        return DB::transaction(function () use ($service, $fields, $values, $actor) {
            $service->loadMissing('templateFields');

            $keys = [];
            foreach ($fields as $index => $fieldInput) {
                $fieldKey = $fieldInput['field_key'];
                $keys[] = $fieldKey;

                ServiceTemplateField::query()->updateOrCreate(
                    [
                        'service_id' => $service->id,
                        'field_key' => $fieldKey,
                    ],
                    [
                        'label' => $fieldInput['label'],
                        'field_type' => $fieldInput['field_type'],
                        'is_required' => (bool) ($fieldInput['is_required'] ?? false),
                        'default_value' => $fieldInput['default_value'] ?? null,
                        'options' => $fieldInput['options'] ?? null,
                        'display_order' => $fieldInput['display_order'] ?? $index,
                    ]
                );
            }

            if ($keys === []) {
                ServiceTemplateField::query()
                    ->where('service_id', $service->id)
                    ->delete();
            } else {
                ServiceTemplateField::query()
                    ->where('service_id', $service->id)
                    ->whereNotIn('field_key', $keys)
                    ->delete();
            }

            $fieldMap = ServiceTemplateField::query()
                ->where('service_id', $service->id)
                ->get()
                ->keyBy('field_key');

            ServiceTemplateValue::query()->where('service_id', $service->id)->delete();
            foreach ($values as $valueInput) {
                $field = $fieldMap->get($valueInput['field_key']);
                if (! $field) {
                    continue;
                }
                ServiceTemplateValue::query()->create([
                    'service_id' => $service->id,
                    'service_plan_id' => $valueInput['service_plan_id'] ?? null,
                    'template_field_id' => $field->id,
                    'value' => $valueInput['value'] ?? null,
                    'updated_by' => $actor?->id,
                ]);
            }

            $service->unsetRelation('templateFields');
            $service->unsetRelation('templateValues');

            return $this->snapshot($service);
        });
    }
}
