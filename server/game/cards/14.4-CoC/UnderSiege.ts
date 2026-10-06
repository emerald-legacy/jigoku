import DrawCard from '../../DrawCard.js';
import { Location, Duration } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';
import { hideWhenFaceUp, playerDelayedEffect } from '../../effects.js';
import {
    chosenDiscard,
    conditional,
    draw,
    handler,
    playerLastingEffect,
    sequential
} from '../../GameActions/GameActions.js';
import type Player from '../../Player.js';

class UnderSiege extends DrawCard {
    static id = 'under-siege';

    private setAsideCards: DrawCard[] = [];
    private targetPlayer: Player | null = null;

    setupCardAbilities() {
        this.reaction('Place defender under siege')
            .when({
                onConflictDeclared: (_event, context) => context.game.currentConflict !== null && context.game.currentConflict.defendingPlayer !== null
            })
            .gameAction(sequential([
                playerLastingEffect(context => ({
                    duration: Duration.UntilEndOfRound,
                    targetController: context.game.currentConflict ? context.game.currentConflict.defendingPlayer : undefined,
                    effect: playerDelayedEffect({
                        when: {
                            onConflictFinished: () => true
                        },
                        gameAction: sequential([
                            chosenDiscard(() => ({
                                amount: 1000 //discard the entire hand
                            })),
                            handler({
                                handler: context => {
                                    if(this.targetPlayer && this.setAsideCards.length > 0) {
                                        const targetPlayer = this.targetPlayer;
                                        context.game.addMessage('{0} picks up their original hand', targetPlayer);

                                        this.setAsideCards.forEach((card) => {
                                            targetPlayer.moveCard(card, Location.Hand);
                                        });
                                    }
                                    this.setAsideCards = [];
                                    this.targetPlayer = null;
                                }
                            })
                        ])
                    })
                })),
                conditional({
                    condition: context => {
                        const conflict = context.game.currentConflict;
                        return conflict !== null && conflict.defendingPlayer !== null && conflict.defendingPlayer.hand.length > 0;
                    },
                    trueGameAction: sequential([
                        handler({
                            handler: context => {
                                const conflict = context.game.currentConflict;
                                if(!conflict || !conflict.defendingPlayer) {
                                    return;
                                }
                                const player = conflict.defendingPlayer;
                                const setAsideCards = [...player.hand];
                                this.targetPlayer = player;
                                this.setAsideCards = setAsideCards;
                                this.game.addMessage('{0} sets their hand aside and draws 5 cards', player);
                                if(setAsideCards.length > 0) {
                                    setAsideCards.forEach((card) => {
                                        player.moveCard(card, Location.RemovedFromGame);
                                        card.lastingEffect(() => ({
                                            until: {
                                                onCardMoved: event => event.card === card && event.originalLocation === Location.RemovedFromGame
                                            },
                                            match: card,
                                            effect: hideWhenFaceUp()
                                        }));
                                    });
                                }
                            }
                        }),
                        draw(context => ({
                            target: context.game.currentConflict ? context.game.currentConflict.defendingPlayer : undefined,
                            amount: 5
                        }))
                    ]),
                    falseGameAction: handler({
                        handler: () => {
                            this.setAsideCards = [];
                            this.targetPlayer = null;
                        }
                    })
                })
            ]))
            .effect('place {1} under siege', context => [context.game.currentConflict ? context.game.currentConflict.defendingPlayer : ''])
            .max(AbilityDsl.limit.perConflict(1));
    }
}


export default UnderSiege;
