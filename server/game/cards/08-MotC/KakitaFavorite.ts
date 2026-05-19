import DrawCard from '../../drawcard.js';

class KakitaFavorite extends DrawCard {
    static id = 'kakita-favorite';

    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: context =>
                this.game.currentDuel &&
                this.game.currentDuel.isInvolvedInAnyDuel(context.source),
            effect: ability.effects.modifyPoliticalSkill(2)
        });
    }
}


export default KakitaFavorite;
