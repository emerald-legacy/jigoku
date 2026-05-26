import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';

class KoboIchiKaiJujutsu extends DrawCard {
    static id = 'kobo-ichi-kai-jujutsu';

    setupCardAbilities() {
        this.whileAttached({
            effect: AbilityDsl.effects.attachmentMilitarySkillModifier((card: any, context: any) => context.player.opponent ? context.player.opponent.getClaimedRings().length : 0)
        });
    }
}


export default KoboIchiKaiJujutsu;
