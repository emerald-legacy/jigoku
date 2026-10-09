import { CardType } from '../../Constants.js';
import { setMilitarySkill, setPoliticalSkill } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';

export default class ApprenticeEarthcaller extends DrawCard {
    static id = 'apprentice-earthcaller';

    setupCardAbilities() {
        this.action('Set skill values to printed values')
            .target({
                cardType: CardType.Character,
                cardCondition: (card) => card.isAttacking() && card.attachments.length === 0
            }, cardLastingEffect((context) => ({
                effect: [
                    setMilitarySkill(context.target.printedMilitarySkill),
                    setPoliticalSkill(context.target.printedPoliticalSkill)
                ]
            })))
            .chatText('set {0}\'s skill values to their printed values until the end of the conflict');
    }
}
