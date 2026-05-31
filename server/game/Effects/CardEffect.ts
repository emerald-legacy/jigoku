import Effect, { type EffectMatchFn, type EffectProperties } from './Effect.js';
import { Locations, Players, CardTypes } from '../Constants.js';
import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import type Game from '../Game.js';
import type { GameObject } from '../GameObject.js';
import type StaticEffect from './StaticEffect.js';

export default class CardEffect extends Effect {
    targetController: string;
    targetLocation: Locations | Locations[];

    constructor(game: Game, source: BaseCard, properties: EffectProperties, effect: StaticEffect) {
        if(!properties.match) {
            properties.match = (card: GameObject, context?: AbilityContext) => card === context?.source;
            if(properties.location === Locations.Any) {
                properties.targetLocation = Locations.Any;
            } else if([CardTypes.Province, CardTypes.Stronghold, CardTypes.Holding].includes(source.type)) {
                properties.targetLocation = Locations.Provinces;
            }
        }
        super(game, source, properties, effect);
        this.targetController = properties.targetController || Players.Self;
        this.targetLocation = properties.targetLocation || Locations.PlayArea;
    }

    isValidTarget(target: GameObject): boolean {
        if(target === this.match) {
            // This is a hack to check whether this is a lasting effect
            return true;
        }
        const sourceController = this.source.controller;
        return (
            target.allowGameAction('applyEffect', this.context) &&
            (this.targetController !== Players.Self || (target as BaseCard).controller === sourceController) &&
            (this.targetController !== Players.Opponent || (target as BaseCard).controller !== sourceController)
        );
    }

    getTargets(): GameObject[] {
        const matchFn = this.match as EffectMatchFn;
        if(this.targetLocation === Locations.Any) {
            return this.game.allCards.filter((card: BaseCard) => matchFn(card, this.context));
        } else if(this.targetLocation === Locations.Provinces) {
            let cards = this.game.allCards.filter((card: BaseCard) => card.isInProvince());
            return cards.filter((card: BaseCard) => matchFn(card, this.context));
        } else if(this.targetLocation === Locations.PlayArea) {
            return this.game.findAnyCardsInPlay((card: BaseCard) => matchFn(card, this.context));
        }
        return this.game.allCards.filter((card: BaseCard) => matchFn(card, this.context) && card.location === this.targetLocation);
    }
}
