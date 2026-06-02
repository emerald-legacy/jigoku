import { CardType, EventName, Location, PlayType } from '../../../Constants.js';
import { EventRegistrar } from '../../../EventRegistrar.js';
import AbilityDsl from '../../../abilitydsl.js';
import BaseCard from '../../../BaseCard.js';
import DrawCard from '../../../DrawCard.js';

export default class ChainOfCommand extends DrawCard {
    static id = 'chain-of-command';

    private eventRegistrar?: EventRegistrar;

    public setupCardAbilities() {
        this.eventRegistrar = new EventRegistrar(this.game, this);
        this.eventRegistrar.register([EventName.OnCardPlayed]);

        this.persistentEffect({
            location: Location.ConflictDiscardPile,
            effect: AbilityDsl.effects.canPlayFromOwn(Location.ConflictDiscardPile, [this], this, PlayType.Other)
        });
        this.action({
            title: 'Ready a character',
            cost: AbilityDsl.costs.bow({
                cardType: CardType.Character,
                cardCondition: (card: BaseCard) => !card.isUnique()
            }),
            target: {
                activePromptTitle: 'Choose a unique character',
                cardType: CardType.Character,
                cardCondition: (card) => card.isUnique(),
                gameAction: AbilityDsl.actions.ready()
            }
        });
    }

    public onCardPlayed(event: any) {
        if(event.card === this) {
            if(this.location !== Location.RemovedFromGame) {
                this.game.addMessage('{0} is removed from the game due the effects of {0}', this);
                this.owner.moveCard(this, Location.RemovedFromGame);
            }
        }
    }
}
