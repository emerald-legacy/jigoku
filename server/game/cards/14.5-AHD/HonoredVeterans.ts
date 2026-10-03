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

        this.action('Honor characters')
            .condition(() => this.canBePlayed())
            .target('myCharacter', {
                cardType: CardType.Character,
                controller: Players.Self,
                optional: true,
                hideIfNoLegalTargets: true,
                cardCondition: (card) => card.hasTrait('bushi') && this.wasCharacterPlayedThisPhase(card)
            }, AbilityDsl.actions.honor())
            .target('oppCharacter', {
                player: Players.Opponent,
                cardType: CardType.Character,
                controller: Players.Opponent,
                optional: true,
                hideIfNoLegalTargets: true,
                cardCondition: (card) => card.hasTrait('bushi') && this.wasCharacterPlayedThisPhase(card)
            }, AbilityDsl.actions.honor())
            .effect('honor {1}', (context) => [this.getCharacters(context)]);
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

    private getCharacters(context: AbilityContext): Array<string | BaseCard> {
        const characters: Array<string | BaseCard> = [];
        if(context.targets.myCharacter && !Array.isArray(context.targets.myCharacter)) {
            characters.push(context.targets.myCharacter);
        }
        if(context.targets.oppCharacter && !Array.isArray(context.targets.oppCharacter)) {
            characters.push(context.targets.oppCharacter);
        }
        if(characters.length === 0) {
            characters.push('no one');
        }

        return characters;
    }
}
