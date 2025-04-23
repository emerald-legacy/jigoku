import AbilityDsl from '../../../abilitydsl';
import { Locations } from '../../../Constants';
import DrawCard from '../../../drawcard';

export default class SenseisHeirloom extends DrawCard {
    static id = 'sensei-s-heirloom';

    setupCardAbilities() {
        this.attachmentConditions({ trait: 'bushi' });

        this.reaction({
            title: 'Search the top of your deck for a card',
            when: {
                onCardAttached: (event, context) => event.card === context.source
            },
            gameAction: AbilityDsl.actions.deckSearch((context) => ({
                amount: 2 * (context.source.parent as DrawCard).printedGlory,
                gameAction: AbilityDsl.actions.moveCard({ destination: Locations.Hand })
            }))
        });
    }
}
