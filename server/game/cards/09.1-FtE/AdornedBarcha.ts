import DrawCard from '../../drawcard.js';
import { CardTypes } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class AdornedBarcha extends DrawCard {
    static id = 'adorned-barcha';

    setupCardAbilities() {
        this.attachmentConditions({
            myControl: true,
            unique: true
        });

        this.action({
            title: 'Move character into the conflict',
            condition: context => !!(context.source.parent && !context.source.parent.isParticipating() && this.game.isDuringConflict('military')),
            target: {
                cardType: CardTypes.Character,
                cardCondition: card => card.isParticipating(),
                gameAction: AbilityDsl.actions.bow()
            },
            gameAction: AbilityDsl.actions.moveToConflict(context => ({ target: context.source.parent }))
        });
    }
}


export default AdornedBarcha;
