import { Players } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import { cardCannot } from '../../effects.js';

export default class ConflictBetweenKin extends ProvinceCard {
    static id = 'conflict-between-kin';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.source.isConflictProvince(),
            targetController: Players.Opponent,
            match: (card) => card.isParticipating(),
            effect: [
                cardCannot({
                    cannot: 'target',
                    restricts: 'eventsWithSameClan'
                }),
                cardCannot({
                    cannot: 'target',
                    restricts: 'attachmentsWithSameClan'
                })
            ]
        });
    }
}
