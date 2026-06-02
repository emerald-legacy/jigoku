import DrawCard from '../../DrawCard.js';
import { Location, Duration } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';
import type Player from '../../Player.js';

class UnderSiege extends DrawCard {
    static id = 'under-siege';

    setAsideCards!: DrawCard[];
    targetPlayer!: Player | null;

    setupCardAbilities() {
        this.setAsideCards = [];
        this.targetPlayer = null;

        this.reaction({
            title: 'Place defender under siege',
            when: {
                onConflictDeclared: (event, context) => context.game.currentConflict !== null && context.game.currentConflict.defendingPlayer !== null
            },
            max: AbilityDsl.limit.perConflict(1),
            effect: 'place {1} under siege!',
            effectArgs: context => [context.game.currentConflict ? context.game.currentConflict.defendingPlayer : ''],
            gameAction: AbilityDsl.actions.sequential([
                AbilityDsl.actions.playerLastingEffect(context => ({
                    duration: Duration.UntilEndOfRound,
                    targetController: context.game.currentConflict ? context.game.currentConflict.defendingPlayer : undefined,
                    effect: AbilityDsl.effects.playerDelayedEffect({
                        when: {
                            onConflictFinished: () => true
                        },
                        gameAction: AbilityDsl.actions.sequential([
                            AbilityDsl.actions.chosenDiscard(() => ({
                                amount: 1000 //discard the entire hand
                            })),
                            AbilityDsl.actions.handler({
                                handler: context => {
                                    if(this.targetPlayer && this.setAsideCards && this.setAsideCards.length > 0) {
                                        const targetPlayer = this.targetPlayer;
                                        context.game.addMessage('{0} picks up their original hand', targetPlayer);

                                        this.setAsideCards.forEach((card: any) => {
                                            targetPlayer.moveCard(card, Location.Hand);
                                        });
                                    }
                                }
                            })
                        ])
                    })
                })),
                AbilityDsl.actions.conditional(({
                    condition: context => {
                        const conflict = context.game.currentConflict;
                        return conflict !== null && conflict.defendingPlayer !== null && conflict.defendingPlayer.hand.length > 0;
                    },
                    trueGameAction: AbilityDsl.actions.sequential([
                        AbilityDsl.actions.handler({
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
                                    setAsideCards.forEach((card: any) => {
                                        player.moveCard(card, Location.RemovedFromGame);
                                        card.lastingEffect(() => ({
                                            until: {
                                                onCardMoved: (event: any) => event.card === card && event.originalLocation === Location.RemovedFromGame
                                            },
                                            match: card,
                                            effect: AbilityDsl.effects.hideWhenFaceUp()
                                        }));
                                    });
                                }
                            }
                        }),
                        AbilityDsl.actions.draw(context => ({
                            target: context.game.currentConflict ? context.game.currentConflict.defendingPlayer : undefined,
                            amount: 5
                        }))
                    ]),
                    falseGameAction: AbilityDsl.actions.handler({
                        handler: () => {}
                    })
                }))
            ])
        });
    }
}


export default UnderSiege;
