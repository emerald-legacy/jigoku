import Effect from './Effect.js';
import { Locations, Players, CardTypes } from '../Constants.js';
import type Game from '../game.js';

export default class CardEffect extends Effect {
    targetController: string;
    targetLocation: string;

    constructor(game: Game, source: any, properties: any, effect: any) {
        if(!properties.match) {
            properties.match = (card: any, context: any) => card === context.source;
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

    isValidTarget(target: any): boolean {
        if(target === this.match) {
            // This is a hack to check whether this is a lasting effect
            return true;
        }
        return (
            target.allowGameAction('applyEffect', this.context) &&
            (this.targetController !== Players.Self || target.controller === this.source.controller) &&
            (this.targetController !== Players.Opponent || target.controller !== this.source.controller)
        );
    }

    getTargets(): any[] {
        if(this.targetLocation === Locations.Any) {
            return this.game.allCards.filter((card: any) => this.match(card, this.context));
        } else if(this.targetLocation === Locations.Provinces) {
            let cards = this.game.allCards.filter((card: any) => card.isInProvince());
            return cards.filter((card: any) => this.match(card, this.context));
        } else if(this.targetLocation === Locations.PlayArea) {
            return this.game.findAnyCardsInPlay((card: any) => this.match(card, this.context));
        }
        return this.game.allCards.filter((card: any) => this.match(card, this.context) && card.location === this.targetLocation);
    }
}
