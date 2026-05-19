import { CardTypes, EventNames } from '../../../Constants.js';
import { EventRegistrar } from '../../../EventRegistrar.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../drawcard.js';

export default class ZealousExorcist extends DrawCard {
    static id = 'zealous-exorcist';

    private charactersPlayedThisConflict = new WeakSet<DrawCard>();
    private eventRegistrar?: EventRegistrar;

    public setupCardAbilities() {
        this.eventRegistrar = new EventRegistrar(this.game, this);
        this.eventRegistrar.register([EventNames.OnConflictStarted, EventNames.OnCharacterEntersPlay]);

        this.action({
            title: 'Remove a character from play',
            condition: (context) => context.source.isParticipating(),
            target: {
                cardType: CardTypes.Character,
                cardCondition: (card: DrawCard) => this.charactersPlayedThisConflict.has(card),
                gameAction: AbilityDsl.actions.removeFromGame()
            }
        });
    }

    public onConflictStarted() {
        this.charactersPlayedThisConflict = new WeakSet();
    }

    public onCharacterEntersPlay(event: any) {
        this.charactersPlayedThisConflict.add(event.card);
    }
}
