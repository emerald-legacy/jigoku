import type BaseCard from '../../BaseCard.js';
import type { StoredPersistentEffect } from '../../BaseCard.js';
import type { CardAbility } from '../../CardAbility.js';
import { EffectName, Location } from '../../Constants.js';
import { EffectBuilder } from '../EffectBuilder.js';
import { CarriedAbilities } from '../CarriedAbilities.js';

export class GainPrintedAbilities extends CarriedAbilities<BaseCard> {
    // not text the card has as an attachment (attachmentText)
    protected override carries(ability: CardAbility): boolean {
        return ability.isPrintedAbility();
    }

    protected override persistentEffectApplies(effect: StoredPersistentEffect): boolean {
        return effect.location === Location.PlayArea || effect.location === Location.Any;
    }
}

export function gainPrintedAbilities(character: BaseCard) {
    return EffectBuilder.card.static(EffectName.GainPrintedAbilities, new GainPrintedAbilities(character));
}
