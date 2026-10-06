import type { CardGameAction } from '../../GameActions/CardGameAction.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import { discardCard } from '../../GameActions/GameActions.js';
import { msg } from '../../GameChat.js';

export default class DesertedShrine extends ProvinceCard {
    static id = 'deserted-shrine';

    setupCardAbilities() {
        this.reaction('Discard the top 10 cards of a deck')
            .when({
                onCardRevealed: (event, context) => event.card === context.source
            })
            .selectFrom({
                targets: true,
                activePromptTitle: 'Choose a deck'
            }, (context) => {
                const choices: [string, CardGameAction][] = [];
                if(context.player.dynastyDeck.length > 0) {
                    choices.push([
                        `${context.player.name}'s Dynasty`,
                        discardCard((context) => ({
                            target: context.player.dynastyDeck.slice(0, 10)
                        }))
                    ]);
                }
                if(context.player.conflictDeck.length > 0) {
                    choices.push([
                        `${context.player.name}'s Conflict`,
                        discardCard((context) => ({
                            target: context.player.conflictDeck.slice(0, 10)
                        }))
                    ]);
                }
                const opponent = context.player.opponent;
                if(opponent && opponent.dynastyDeck.length > 0) {
                    choices.push([
                        `${opponent.name}'s Dynasty`,
                        discardCard((context) => ({
                            target: context.player.opponent ? context.player.opponent.dynastyDeck.slice(0, 10) : []
                        }))
                    ]);
                }
                if(opponent && opponent.conflictDeck.length > 0) {
                    choices.push([
                        `${opponent.name}'s Conflict`,
                        discardCard((context) => ({
                            target: context.player.opponent ? context.player.opponent.conflictDeck.slice(0, 10) : []
                        }))
                    ]);
                }

                return Object.fromEntries(choices);
            })
            .effect((context) => msg`discard the top 10 cards of ${context.select} deck`);
    }
}
