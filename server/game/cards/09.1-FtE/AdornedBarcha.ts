import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
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
            condition: context => !!(context.source.parentCharacter && !context.source.parentCharacter.isParticipating() && this.game.isDuringConflict('military')),
            target: {
                cardType: CardType.Character,
                cardCondition: card => card.isParticipating(),
                gameAction: AbilityDsl.actions.bow()
            },
            gameAction: AbilityDsl.actions.moveToConflict(context => ({ target: context.source.parentCharacter ?? [] }))
        });
    }
}


export default AdornedBarcha;
