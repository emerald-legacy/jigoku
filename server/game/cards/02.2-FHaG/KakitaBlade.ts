import { modifyPoliticalSkill } from '../../effects.js';
import DrawCard from '../../DrawCard.js';

export default class KakitaBlade extends DrawCard {
    static id = 'kakita-blade';

    setupCardAbilities() {
        this.whileAttached({
            condition: () => !!this.parentCharacter && (this.game.currentDuel?.isInvolvedInAnyDuel(this.parentCharacter) ?? false),
            effect: modifyPoliticalSkill(2)
        });

        this.reaction('Gain honor on duel win')
            .when({
                afterDuel: (event, context) => event.winner?.some((card) => card === context.source.parentCharacter) ?? false
            })
            .gainHonor();
    }
}
