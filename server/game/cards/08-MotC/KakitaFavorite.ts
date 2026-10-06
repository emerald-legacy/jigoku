import DrawCard from '../../DrawCard.js';
import { modifyPoliticalSkill } from '../../effects.js';

class KakitaFavorite extends DrawCard {
    static id = 'kakita-favorite';

    setupCardAbilities() {
        this.persistentEffect({
            condition: context =>
                this.game.currentDuel !== null &&
                this.game.currentDuel.isInvolvedInAnyDuel(context.source),
            effect: modifyPoliticalSkill(2)
        });
    }
}


export default KakitaFavorite;
