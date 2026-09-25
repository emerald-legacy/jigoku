import { CardType, Duration, Location } from '../../../Constants.js';
import { ProvinceCard } from '../../../ProvinceCard.js';
import AbilityDsl from '../../../abilitydsl.js';
import type { AbilityContext } from '../../../AbilityContext.js';
import DrawCard from '../../../DrawCard.js';
import { shuffle } from '../../../utils/shuffle.js';

export default class EaglesRestPeak extends ProvinceCard {
    static id = 'eagle-s-rest-peak';

    public setupCardAbilities() {
        this.action<DrawCard>({
            title: 'Look at random cards from opponent\'s hand',
            condition: (context) => (context.player.opponent?.hand.length ?? 0) > 0,
            target: {
                activePromptTitle: 'Choose a character to lead the investigation',
                cardType: CardType.Character,
                cardCondition: (card: DrawCard) => card.isDefending() && (card.getCost() ?? 0) > 0
            },
            effect: 'use the insight of {0}, revealing and setting aside {1} cards from {2}\'s hand',
            effectArgs: context => [context.target?.getCost() ?? 0, context.player.opponent],
            gameAction: AbilityDsl.actions.sequentialContext((context: AbilityContext<ProvinceCard, DrawCard>) => {
                const opponent = context.player.opponent;
                const setAsideCards: DrawCard[] = shuffle(opponent?.hand ?? [])
                    .slice(0, context.target?.getCost() ?? 0);

                return {
                    gameActions: [
                        AbilityDsl.actions.lookAt({ target: setAsideCards }),

                        AbilityDsl.actions.handler({
                            handler: () => {
                                this.game.addMessage('{0} sets aside {1}', opponent, setAsideCards);
                                if(opponent) {
                                    for(const card of setAsideCards) {
                                        opponent.moveCard(card, Location.RemovedFromGame);
                                    }
                                }
                            }
                        }),

                        AbilityDsl.actions.playerLastingEffect({
                            duration: Duration.UntilEndOfRound,
                            targetController: opponent,
                            effect: AbilityDsl.effects.playerDelayedEffect({
                                when: { onConflictFinished: () => true },
                                gameAction: AbilityDsl.actions.handler({
                                    handler: (context) => {
                                        context.game.addMessage('{0} picks back their cards', opponent);
                                        if(opponent) {
                                            for(const card of setAsideCards) {
                                                opponent.moveCard(card, Location.Hand);
                                            }
                                        }
                                    }
                                })
                            })
                        })
                    ]
                };
            })
        });
    }
}
