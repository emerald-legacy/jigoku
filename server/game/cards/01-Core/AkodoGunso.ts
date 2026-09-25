import type { TriggeredAbilityContext } from '../../TriggeredAbilityContext.js';
import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class AkodoGunso extends DrawCard {
    static id = 'akodo-gunso';

    setupCardAbilities() {
        this.reaction({
            title: 'Refill province faceup',
            when: {
                onCharacterEntersPlay: (event, context) =>
                    event.card === context.source && event.originalLocation !== undefined &&
                    context.game.getProvinceArray().includes(event.originalLocation)
            },
            gameAction: AbilityDsl.actions.refillFaceup((context: TriggeredAbilityContext) => ({ location: context.event.originalLocation ?? [] }))
        });
    }
}


export default AkodoGunso;
