import { CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';

export default class ApprenticeEarthcaller extends DrawCard {
    static id = 'apprentice-earthcaller';

    setupCardAbilities() {
        this.action('Set skill values to printed values')
            .target('target', {
                cardType: CardType.Character,
                cardCondition: (card) => card.isAttacking() && card.attachments.length === 0
            }, AbilityDsl.actions.cardLastingEffect((context) => ({
                effect: [
                    AbilityDsl.effects.setMilitarySkill(context.target.printedMilitarySkill),
                    AbilityDsl.effects.setPoliticalSkill(context.target.printedPoliticalSkill)
                ]
            })))
            .effect('set {0}\'s skill values to their printed values until the end of the conflict');
    }
}
