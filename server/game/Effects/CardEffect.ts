import { ActiveEffect, type EffectMatchFn, type EffectProperties } from './ActiveEffect.js';
import { Location, Players, CardType, RestrictionType } from '../Constants.js';
import type { EffectName } from '../Constants.js';
import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import type { EffectSource } from '../EffectSource.js';
import type Game from '../Game.js';
import type { GameObject } from '../GameObject.js';
import type { EffectApplier } from './EffectApplier.js';
import type Player from '../Player.js';
import type { TargetLocation } from '../Interfaces.js';

const provinceCardTypes: readonly string[] = [CardType.Province, CardType.Stronghold, CardType.Holding];

export class CardEffect extends ActiveEffect<BaseCard> {
    targetController: string | Player;
    targetLocation: TargetLocation;

    constructor(game: Game, source: EffectSource, properties: EffectProperties<BaseCard>, effect: EffectApplier<EffectName, BaseCard>) {
        if(!properties.match) {
            properties = { ...properties };
            properties.match = (card: GameObject, context?: AbilityContext) => card === context?.source;
            if(properties.location === Location.Any) {
                properties.targetLocation = Location.Any;
            } else if(provinceCardTypes.includes(source.type)) {
                properties.targetLocation = Location.Provinces;
            }
        }
        super(game, source, properties, effect);
        this.targetController = properties.targetController || Players.Self;
        this.targetLocation = properties.targetLocation || Location.PlayArea;
    }

    isValidTarget(target: BaseCard): boolean {
        if(target === this.match) {
            // This is a hack to check whether this is a lasting effect
            return true;
        }
        const sourceController = this.source.getEffectController();
        return (
            target.checkRestrictions(RestrictionType.ApplyEffect, this.context) &&
            (this.targetController !== Players.Self || target.controller === sourceController) &&
            (this.targetController !== Players.Opponent || target.controller !== sourceController)
        );
    }

    getTargets(matchFn: EffectMatchFn<BaseCard>): BaseCard[] {
        if(this.targetLocation === Location.Any) {
            return this.game.allCards.filter((card: BaseCard) => matchFn(card, this.context));
        } else if(this.targetLocation === Location.Provinces) {
            const cards = this.game.allCards.filter((card: BaseCard) => card.isInProvince());
            return cards.filter((card: BaseCard) => matchFn(card, this.context));
        } else if(this.targetLocation === Location.PlayArea) {
            return this.game.findAnyCardsInPlay((card: BaseCard) => matchFn(card, this.context));
        }
        return this.game.allCards.filter((card: BaseCard) => matchFn(card, this.context) && card.location === this.targetLocation);
    }
}
