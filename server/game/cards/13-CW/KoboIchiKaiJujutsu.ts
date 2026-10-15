import DrawCard from '../../DrawCard.js';
import { attachmentMilitarySkillModifier } from '../../effects.js';

class KoboIchiKaiJujutsu extends DrawCard {
    static id = 'kobo-ichi-kai-jujutsu';

    setupCardAbilities() {
        this.whileAttached({
            effect: attachmentMilitarySkillModifier((_card, context) => context.player.opponent ? context.player.opponent.getClaimedRings().length : 0)
        });
    }
}


export default KoboIchiKaiJujutsu;
