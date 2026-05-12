import DrawCard from '../../drawcard';
import AbilityDsl from '../../abilitydsl';
import { DuelTypes } from '../../Constants';

class ReturnTheOffense extends DrawCard {
    static id = 'return-the-offense';

    setupCardAbilities() {
        this.action({
            title: 'Initiate a political duel',
            initiateDuel: {
                type: DuelTypes.Political,
                message: '{0}{1}{2}{3}{4}',
                messageArgs: (duel) => [
                    duel.winner,
                    duel.winner?.length ? ' does not bow as a result of conflict resolution' : '',
                    duel.loser?.length ? ' and ' : '',
                    duel.loser,
                    duel.loser?.length ? ' cannot be readied' : ''
                ],
                gameAction: (duel) => AbilityDsl.actions.multiple([
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
            }
        });
    }
}


export default ReturnTheOffense;
