import DrawCard from '../../DrawCard.js';
import { CardType, ConflictType } from '../../Constants.js';
import { bow } from '../../GameActions/GameActions.js';

class AdornedBarcha extends DrawCard {
    static id = 'adorned-barcha';

    setupCardAbilities() {
        this.attachmentConditions({
            myControl: true,
            unique: true
        });

        this.action('Move character into the conflict')
            .condition(context => !!(context.source.parentCharacter && !context.source.parentCharacter.isParticipating() && this.game.isDuringConflict(ConflictType.Military)))
            .target({
                cardType: CardType.Character,
                cardCondition: card => card.isParticipating()
            }, bow())
            .moveToConflict(context => ({ target: context.source.parentCharacter ?? [] }));
    }
}


export default AdornedBarcha;
