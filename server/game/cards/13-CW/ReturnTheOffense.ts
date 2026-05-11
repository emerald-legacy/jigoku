import DrawCard from '../../drawcard';
import AbilityDsl from '../../abilitydsl';
import { CardTypes, DuelTypes, Players } from '../../Constants';

class ReturnTheOffense extends DrawCard {
    static id = 'return-the-offense';

    setupCardAbilities() {
        this.action({
            title: 'Initiate a political duel',
            condition: () => this.game.isDuringConflict(),
            targets: {
                challenger: {
                    cardType: CardTypes.Character,
                    controller: Players.Any,
                    cardCondition: (card) => card.isParticipating()
                },
                duelTarget: {
                    dependsOn: 'challenger',
                    cardType: CardTypes.Character,
                    controller: Players.Any,
                    cardCondition: (card, context) =>
                        card.isParticipating() &&
                        card !== context.targets.challenger &&
                        card.controller !== context.targets.challenger.controller,
                    gameAction: AbilityDsl.actions.duel((context) => ({
                        type: DuelTypes.Political,
                        challenger: context.targets.challenger,
                        message: '{0}{1}{2}{3}{4}',
                        messageArgs: duel => [
                            duel.winner,
                            duel.winner ? ' does not bow as a result of conflict resolution' : '',
                            duel.loser ? ' and ' : '',
                            duel.loser,
                            duel.loser ? ' cannot be readied' : ''
                        ],
                        gameAction: duel => AbilityDsl.actions.multiple([
                            AbilityDsl.actions.cardLastingEffect({
                                target: duel.winner,
                                effect: AbilityDsl.effects.doesNotBow()
                            }),
                            AbilityDsl.actions.cardLastingEffect({
                                target: duel.loser,
                                effect: AbilityDsl.effects.cardCannot({
                                    cannot: 'ready',
                                    restricts: 'cardEffects'
                                })
                            })
                        ])
                    }))
                }
            }
        });
    }
}


export default ReturnTheOffense;
