import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class ExemplaryEtiquette extends DrawCard {
    static id = 'exemplary-etiquette';

    setupCardAbilities() {
        this.action('Stop characters from triggering abilities')
            .condition(() => this.game.isDuringConflict())
            .gameAction(AbilityDsl.actions.conflictLastingEffect({
                effect: AbilityDsl.effects.charactersCannot({
                    cannot: 'triggerAbilities'
                })
            }))
            .effect('make it so that characters cannot trigger abilities this conflict');
    }
}


export default ExemplaryEtiquette;
