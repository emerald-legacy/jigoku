import { Players } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import AbilityDsl from '../../abilitydsl.js';

export default class ConflictBetweenKin extends ProvinceCard {
    static id = 'conflict-between-kin';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.source.isConflictProvince(),
            targetController: Players.Opponent,
            match: (card) => card.isParticipating(),
            effect: [
                AbilityDsl.effects.cardCannot({
                    cannot: 'target',
                    restricts: 'eventsWithSameClan'
                }),
                AbilityDsl.effects.cardCannot({
                    cannot: 'target',
                    restricts: 'attachmentsWithSameClan'
                })
            ]
        });
    }
}
