import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import { Location, Players, PlayType } from '../../Constants.js';

class TogashiMitsu extends DrawCard {
    static id = 'togashi-mitsu';

    setupCardAbilities() {
        this.action({
            title: 'Play a monk, kiho or tattoo card from discard',
            condition: context => context.source.isParticipating(),
            target: {
                location: Location.ConflictDiscardPile,
                controller: Players.Self,
                cardCondition: card => card.hasTrait('monk') || card.hasTrait('kiho') || card.hasTrait('tattoo'),
                gameAction: AbilityDsl.actions.playCard({
                    source: this,
                    playType: PlayType.PlayFromHand,
                    destination: Location.ConflictDeck,
                    destinationOptions: { bottom: true }
                })
            }
        });
    }
}


export default TogashiMitsu;
