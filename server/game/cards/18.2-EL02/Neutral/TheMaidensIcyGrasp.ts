import AbilityDsl from '../../../abilitydsl.js';
import { CardType, Duration, EventName } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import { EventRegistrar } from '../../../EventRegistrar.js';

export default class TheMaidensIcyGrasp extends DrawCard {
    static id = 'the-maiden-s-icy-grasp';

    private charactersPlayedThisConflict = new WeakSet<DrawCard>();
    private eventRegistrar?: EventRegistrar;

    public setupCardAbilities() {
        this.eventRegistrar = new EventRegistrar(this.game, this);
        this.eventRegistrar.register([EventName.OnConflictStarted, EventName.OnCharacterEntersPlay]);

        this.action({
            title: 'Remove a character from play',
            condition: (context) =>
                context.player.cardsInPlay.some(
                    (card: DrawCard) => card.isParticipating() && card.hasTrait('shugenja')
                ),
            target: {
                cardType: CardType.Character,
                cardCondition: (card: DrawCard) => this.charactersPlayedThisConflict.has(card),
                gameAction: AbilityDsl.actions.sequential([
                    AbilityDsl.actions.cardLastingEffect((context) => ({
                        effect: [AbilityDsl.effects.cannotContribute(() => (card: any) => card === context.target)],
                        duration: Duration.UntilEndOfConflict
                    })),
                    AbilityDsl.actions.onAffinity({
                        trait: 'water',
                        gameAction: AbilityDsl.actions.removeFate((context) => ({ target: context.target }))
                    })
                ])
            },
            effect: 'prevent {0} from contributing to resolution of this conflict'
        });
    }

    public onConflictStarted() {
        this.charactersPlayedThisConflict = new WeakSet();
    }

    public onCharacterEntersPlay(event: any) {
        this.charactersPlayedThisConflict.add(event.card);
    }
}
