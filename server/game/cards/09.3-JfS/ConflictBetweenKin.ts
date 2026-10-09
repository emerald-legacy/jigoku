import { Players, RestrictionType } from '../../Constants.js';
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
                    cannot: RestrictionType.Target,
                    restricts: 'eventsWithSameClan'
                }),
                cardCannot({
                    cannot: RestrictionType.Target,
                    restricts: 'attachmentsWithSameClan'
                })
            ]
        });
    }
}
