import DrawCard from '../../drawcard';
import AbilityDsl from '../../abilitydsl';
import { TargetModes, CardTypes } from '../../Constants';

class BayushiDairu extends DrawCard {
    static id = 'bayushi-dairu';

    setupCardAbilities() {
        this.action({
            title: 'Move a status token to this character',
            condition: context => context.source.isParticipating(),
            target: {
                mode: TargetModes.Token,
                cardType: CardTypes.Character,
                cardCondition: (card, context) => card !== context.source,
                gameAction: AbilityDsl.actions.moveStatusToken(context => ({ recipient: context.source }))
            }
        });
    }
}


export default BayushiDairu;
