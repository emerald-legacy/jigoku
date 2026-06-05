import Effect, { type EffectMatchFn, type EffectProperties } from './Effect.js';
import { Location, Players, CardType } from '../Constants.js';
import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import type EffectSource from '../EffectSource.js';
import type { SourceWithState } from '../EffectSource.js';
import type Game from '../Game.js';
import type { GameObject } from '../GameObject.js';
import type StaticEffect from './StaticEffect.js';

export default class CardEffect extends Effect {
    targetController: string;
    targetLocation: Location | Location[];

    constructor(game: Game, source: EffectSource, properties: EffectProperties, effect: StaticEffect) {
        if(!properties.match) {
            properties.match = (card: GameObject, context?: AbilityContext) => card === context?.source;
            if(properties.location === Location.Any) {
                properties.targetLocation = Location.Any;
            } else if([CardType.Province, CardType.Stronghold, CardType.Holding].includes(source.type as CardType)) {
                properties.targetLocation = Location.Provinces;
            }
        }
        super(game, source, properties, effect);
        this.targetController = properties.targetController || Players.Self;
        this.targetLocation = properties.targetLocation || Location.PlayArea;
    }

    isValidTarget(target: GameObject): boolean {
        if(target === this.match) {
            // This is a hack to check whether this is a lasting effect
            return true;
        }
        const sourceController = (this.source as SourceWithState).controller;
        return (
            target.allowGameAction('applyEffect', this.context) &&
            (this.targetController !== Players.Self || (target as BaseCard).controller === sourceController) &&
            (this.targetController !== Players.Opponent || (target as BaseCard).controller !== sourceController)
        );
    }

    getTargets(): GameObject[] {
        const matchFn = this.match as EffectMatchFn;
        if(this.targetLocation === Location.Any) {
            return this.game.allCards.filter((card: BaseCard) => matchFn(card, this.context));
        } else if(this.targetLocation === Location.Provinces) {
            let cards = this.game.allCards.filter((card: BaseCard) => card.isInProvince());
            return cards.filter((card: BaseCard) => matchFn(card, this.context));
        } else if(this.targetLocation === Location.PlayArea) {
            return this.game.findAnyCardsInPlay((card: BaseCard) => matchFn(card, this.context));
        }
        return this.game.allCards.filter((card: BaseCard) => matchFn(card, this.context) && card.location === this.targetLocation);
    }
}
