import type BaseCard from '../../BaseCard.js';
import type DrawCard from '../../DrawCard.js';
import type { StoredPersistentEffect } from '../../BaseCard.js';
import { Location, CardType, EffectName } from '../../Constants.js';
import type { TriggeredAbility } from '../../TriggeredAbility.js';
import { EffectBuilder } from '../EffectBuilder.js';
import { CarriedAbilities } from '../CarriedAbilities.js';
import type { ProvinceCard } from '../../ProvinceCard.js';

export class CopyCard<Card extends BaseCard> extends CarriedAbilities<Card> {
    protected override persistentEffectApplies(effect: StoredPersistentEffect, target: BaseCard): boolean {
        return effect.location === Location.Any ||
            (target.getType() === CardType.Character && effect.location === Location.PlayArea) ||
            (target.getType() === CardType.Holding && effect.location === Location.Provinces) ||
            (target.getType() === CardType.Province && effect.location === Location.Provinces);
    }

    override getReactions(target: BaseCard): TriggeredAbility[] {
        const ownKeywordReactions = target.abilities.reactions.filter((ability) => ability.isKeywordAbility());
        return [...super.getReactions(target), ...ownKeywordReactions];
    }
}

export function copyCard(character: DrawCard) {
    return EffectBuilder.card.static(EffectName.CopyCharacter, new CopyCard(character));
}

export function copyProvince(province: ProvinceCard) {
    return EffectBuilder.card.static(EffectName.CopyProvince, new CopyCard(province));
}
