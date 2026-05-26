import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';

class KakitaFavorite extends DrawCard {
    static id = 'kakita-favorite';

    setupCardAbilities() {
        this.persistentEffect({
            condition: context =>
                this.game.currentDuel !== null &&
                this.game.currentDuel.isInvolvedInAnyDuel(context.source),
            effect: AbilityDsl.effects.modifyPoliticalSkill(2)
        });
    }
}


export default KakitaFavorite;
