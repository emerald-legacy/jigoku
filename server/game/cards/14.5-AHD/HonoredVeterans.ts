import type { AbilityContext } from '../../AbilityContext.js';
import AbilityDsl from '../../abilitydsl.js';
import type BaseCard from '../../BaseCard.js';
import { CardType, EventName, Players } from '../../Constants.js';
import DrawCard from '../../DrawCard.js';
import { EventRegistrar } from '../../EventRegistrar.js';
import type { EventPayload } from '../../Events/EventPayloads.js';

export default class HonoredVeterans extends DrawCard {
    static id = 'honored-veterans';

    private eventRegistrar?: EventRegistrar;
    private charactersPlayedThisPhase = new Set<BaseCard>();

    public setupCardAbilities() {
        this.eventRegistrar = new EventRegistrar(this.game, this);
        this.eventRegistrar.register([EventName.OnPhaseStarted, EventName.OnCardPlayed]);

        this.action({
            title: 'Honor characters',
            condition: () => this.canBePlayed(),
            targets: {
                myCharacter: {
                    cardType: CardType.Character,
                    controller: Players.Self,
                    optional: true,
                    hideIfNoLegalTargets: true,
                    cardCondition: (card) => card.hasTrait('bushi') && this.wasCharacterPlayedThisPhase(card),
                    gameAction: AbilityDsl.actions.honor()
                },
                oppCharacter: {
                    player: Players.Opponent,
                    cardType: CardType.Character,
                    controller: Players.Opponent,
                    optional: true,
                    hideIfNoLegalTargets: true,
                    cardCondition: (card) => card.hasTrait('bushi') && this.wasCharacterPlayedThisPhase(card),
                    gameAction: AbilityDsl.actions.honor()
                }
            },
            effect: 'honor {1}',
            effectArgs: (context) => [this.getCharacters(context)]
        });
    }

    public onCardPlayed(event: EventPayload<EventName.OnCardPlayed>) {
        if(event.player && event.card.type === CardType.Character) {
            this.charactersPlayedThisPhase.add(event.card);
        }
    }

    public onPhaseStarted() {
        this.charactersPlayedThisPhase.clear();
    }

    private canBePlayed(): boolean {
        for(const card of this.charactersPlayedThisPhase) {
            if(card.hasTrait('bushi')) {
                return true;
            }
        }
        return false;
    }

    private wasCharacterPlayedThisPhase(card: BaseCard): boolean {
        return this.charactersPlayedThisPhase.has(card);
    }

    private getCharacters(context: AbilityContext): Array<string | DrawCard> {
        const characters: Array<string | DrawCard> = [];
        if(context.targets.myCharacter && !Array.isArray(context.targets.myCharacter)) {
            characters.push(context.targets.myCharacter as DrawCard);
        }
        if(context.targets.oppCharacter && !Array.isArray(context.targets.oppCharacter)) {
            characters.push(context.targets.oppCharacter as DrawCard);
        }
        if(characters.length === 0) {
            characters.push('no one');
        }

        return characters;
    }
}
