import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class KoboIchiKaiJujutsu extends DrawCard {
    static id = 'kobo-ichi-kai-jujutsu';

    setupCardAbilities() {
        this.whileAttached({
            effect: AbilityDsl.effects.attachmentMilitarySkillModifier((card, context) => context.player.opponent ? context.player.opponent.getClaimedRings().length : 0)
        });
    }
}


export default KoboIchiKaiJujutsu;
