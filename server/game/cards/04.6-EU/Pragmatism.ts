import { cardCannot, modifyMilitarySkill, modifyPoliticalSkill } from '../../effects.js';
import DrawCard from '../../DrawCard.js';
import { RestrictionType } from '../../Constants.js';

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
                cardCannot(RestrictionType.Honor),
                cardCannot(RestrictionType.Dishonor)
            ]
        });
    }
}


export default Pragmatism;
