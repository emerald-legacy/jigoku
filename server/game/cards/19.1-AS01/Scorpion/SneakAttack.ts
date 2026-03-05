import { Durations, Locations } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class SneakAttack extends DrawCard {
    static id = 'sneak-attack';

    private setAsideCards: DrawCard[] = [];

    public setupCardAbilities() {
        this.reaction({
            title: 'The attacker gets the first action opportunity',
            cost: AbilityDsl.costs.payHonor(1),
            when: {
                onConflictStarted: (event, context) => event.conflict.attackingPlayer === context.player
            },
            effect: 'give {1} the first action in this conflict{2}',
            effectArgs: (context) => [
                context.player,
                context.player.opponent.hand.size() > 0 ? ' and sets aside opponent\'s cards' : ''
            ],
            gameAction: AbilityDsl.actions.sequential([
                AbilityDsl.actions.handler({
                    handler: (context) => {
                        const opponent = context.player.opponent;
                        if(!opponent || opponent.hand.size() === 0) {
                            return;
                        }

                        this.setAsideCards = opponent.hand.shuffle().slice(0, 2);
                        if(this.setAsideCards.length === 0) {
                            return;
                        }

                        this.game.addMessage('{0} sets aside {1}', opponent, this.setAsideCards);
                        for(const card of this.setAsideCards) {
                            opponent.moveCard(card, Locations.RemovedFromGame);
                        }
                    }
                }),
                AbilityDsl.actions.playerLastingEffect((context) => ({
                    duration: Durations.UntilEndOfRound,
                    targetController: context.player.opponent,
                    effect: AbilityDsl.effects.playerDelayedEffect({
                        when: { onConflictFinished: () => true },
                        gameAction: AbilityDsl.actions.handler({
                            handler: (context) => {
                                if(this.setAsideCards.length === 0) {
                                    return;
                                }
                                const opponent = this.setAsideCards[0].owner;
                                context.game.addMessage('{0} picks back their cards', opponent);
                                for(const card of this.setAsideCards) {
                                    opponent.moveCard(card, Locations.Hand);
                                }
                                this.setAsideCards = [];
                            }
                        })
                    })
                })),
                AbilityDsl.actions.playerLastingEffect((context) => ({
                    targetController: context.player,
                    effect: AbilityDsl.effects.gainActionPhasePriority()
                }))
            ])
        });
    }
}
