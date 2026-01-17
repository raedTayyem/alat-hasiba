'use client';

import { useTranslation } from 'react-i18next';
import { Heir, heirCategories } from './types';
import { NumberInput } from '@/components/ui/number-input';
import { Combobox } from '@/components/ui/combobox';

interface HeirSelectorProps {
  heirs: Heir[];
  onToggleHeir: (id: string) => void;
  onUpdateCount: (id: string, count: string) => void;
}

export default function HeirSelector({ heirs, onToggleHeir, onUpdateCount }: HeirSelectorProps) {
  const { t } = useTranslation('calc/finance');

  return (
    <div className="space-y-6">
      {heirCategories.map((category) => (
        <div key={category.id} className="card-container p-4">
          <h3 className="text-lg font-bold mb-4">{t(category.nameKey)}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {heirs
              .filter((heir) => heir.category === category.id)
              .map((heir) => (
                <div key={heir.id} className="flex items-center space-x-4 space-x-reverse">
                  <input
                    type="checkbox"
                    id={heir.id}
                    checked={heir.selected}
                    onChange={() => onToggleHeir(heir.id)}
                    className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor={heir.id} className="flex-1 cursor-pointer">
                    <span>{t(heir.nameKey)}</span>
                  </label>

                  {heir.selected && (
                    <div className="w-24">
                      {heir.id === 'husband' || heir.id === 'wife' ||
                       heir.id === 'father' || heir.id === 'mother' ||
                       heir.id === 'grandfather' || heir.id === 'grandmother' ? (
                        <NumberInput
                          value={heir.count.toString()}
                          onValueChange={(val) => onUpdateCount(heir.id, val.toString())}
                          min={1}
                          max={4}
                          readOnly={true}
                          className="w-full text-center bg-gray-100"
                        />
                      ) : (
                        <Combobox
                          options={[...Array(10)].map((_, i) => ({
                            value: (i + 1).toString(),
                            label: (i + 1).toString()
                          }))}
                          value={heir.count.toString()}
                          onChange={(value: string) => onUpdateCount(heir.id, value)}
                          placeholder={t("inheritance-calculator.table.count")}
                        />
                      )}
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
