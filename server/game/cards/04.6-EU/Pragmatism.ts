import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';

class Pragmatism extends DrawCard {
    static id = 'pragmatism';

    setupCardAbilities() {
        this.attachmentConditions({
            myControl: true
        });

        this.whileAttached({
            condition: context => context.player.isLessHonorable(),
            effect: [
                AbilityDsl.effects.modifyMilitarySkill(1),
                AbilityDsl.effects.modifyPoliticalSkill(1),
                AbilityDsl.effects.cardCannot('honor'),
                AbilityDsl.effects.cardCannot('dishonor')
            ]
        });
    }
}


export default Pragmatism;
