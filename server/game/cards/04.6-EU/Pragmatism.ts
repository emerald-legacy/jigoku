import { cardCannot, modifyMilitarySkill, modifyPoliticalSkill } from '../../effects.js';
import DrawCard from '../../DrawCard.js';

class Pragmatism extends DrawCard {
    static id = 'pragmatism';

    setupCardAbilities() {
        this.attachmentConditions({
            myControl: true
        });

        this.whileAttached({
            condition: (context) => context.player.isLessHonorable(),
            effect: [
                modifyMilitarySkill(1),
                modifyPoliticalSkill(1),
                cardCannot('honor'),
                cardCannot('dishonor')
            ]
        });
    }
}


export default Pragmatism;
