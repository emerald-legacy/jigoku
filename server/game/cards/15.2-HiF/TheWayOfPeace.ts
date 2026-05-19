import { TargetModes, CardTypes, Players } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import AbilityDsl from '../../abilitydsl.js';

export default class TheWayOfPeace extends ProvinceCard {
    static id = 'the-way-of-peace';

    setupCardAbilities() {
        this.interrupt({
            title: 'honor up to 3 characters',
            when: {
                onBreakProvince: (event, context) => event.card === context.source
            },
            target: {
                mode: TargetModes.UpTo,
                numCards: 3,
                cardType: CardTypes.Character,
                controller: Players.Any,
                player: Players.Self
            },
            gameAction: AbilityDsl.actions.honor((context) => ({
                target: context.target
            }))
        });
    }
}
