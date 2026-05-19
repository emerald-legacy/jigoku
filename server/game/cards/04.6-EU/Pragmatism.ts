import DrawCard from '../../drawcard.js';

class Pragmatism extends DrawCard {
    static id = 'pragmatism';

    setupCardAbilities(ability) {
        this.attachmentConditions({
            myControl: true
        });

        this.whileAttached({
            condition: context => context.player.isLessHonorable(),
            effect: [
                ability.effects.modifyMilitarySkill(1),
                ability.effects.modifyPoliticalSkill(1),
                ability.effects.cardCannot('honor'),
                ability.effects.cardCannot('dishonor')
            ]
        });
    }
}


export default Pragmatism;
