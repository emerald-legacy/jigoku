import { AbilityContext } from '../../../AbilityContext.js';
import type { TriggeredAbilityContext } from '../../../TriggeredAbilityContext.js';
import AbilityDsl from '../../../abilitydsl.js';
import { Element, EventName } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import type BaseCard from '../../../BaseCard.js';
import type Player from '../../../Player.js';
import Ring from '../../../Ring.js';

import type { EventPayload } from '../../../Events/EventPayloads.js';
const ELEMENT_KEY = 'kitsuki-seiji-water';

export default class KitsukiSeiji extends DrawCard {
    static id = 'kitsuki-seiji';

    public setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.player.showBid % 2 === 1,
            effect: [AbilityDsl.effects.modifyMilitarySkill(+2), AbilityDsl.effects.modifyPoliticalSkill(-2)]
        });
        this.persistentEffect({
            condition: (context) => context.player.showBid % 2 === 0,
            effect: [AbilityDsl.effects.modifyMilitarySkill(-2), AbilityDsl.effects.modifyPoliticalSkill(+2)]
        });

        this.wouldInterrupt({
            title: 'Put fate on this character',
            when: {
                onMoveFate: (event: EventPayload<EventName.OnMoveFate>) => this.fateRecipientIsSeijisRing(event.recipient),
                onPlaceFateOnUnclaimedRings: (event: EventPayload<EventName.OnPlaceFateOnUnclaimedRings>) =>
                    (event.recipients ?? []).some((recipient) => this.fateRecipientIsSeijisRing(recipient.ring))
            },
            effect: 'put the fate that would go on the {1} ring on {0} instead',
            effectArgs: () => [this.getCurrentElementSymbol(ELEMENT_KEY)],
            gameAction: AbilityDsl.actions.cancel((context) => {
                switch((context as TriggeredAbilityContext).event.name) {
                    case 'onPlaceFateOnUnclaimedRings':
                        return { replacementGameAction: this.replacementForPlaceFateOnUnclaimedRings(context) };
                    case 'onMoveFate':
                        return { replacementGameAction: this.replacementForMoveFate(context) };
                    default:
                        return { replacementGameAction: AbilityDsl.actions.noAction() };
                }
            })
        });
    }

    public getPrintedElementSymbols() {
        const symbols = super.getPrintedElementSymbols();
        symbols.push({
            key: ELEMENT_KEY,
            prettyName: 'Ring',
            element: Element.Water
        });
        return symbols;
    }

    private fateRecipientIsSeijisRing(recipient?: Player | BaseCard | Ring) {
        return (
            recipient instanceof Ring && recipient.hasElement(this.getCurrentElementSymbol(ELEMENT_KEY))
        );
    }

    private replacementForMoveFate(context: AbilityContext) {
        const event = (context as TriggeredAbilityContext).event;
        return AbilityDsl.actions.placeFate({
            origin: event.origin as DrawCard | Player | Ring | undefined,
            target: context.source,
            amount: event.fate
        });
    }

    private replacementForPlaceFateOnUnclaimedRings(context: AbilityContext) {
        return AbilityDsl.actions.joint(
            ((context as TriggeredAbilityContext).event.recipients ?? []).map((recipient) => {
                const isSeijisRing = recipient.ring.hasElement(this.getCurrentElementSymbol(ELEMENT_KEY));
                if(isSeijisRing) {
                    return AbilityDsl.actions.placeFate({
                        target: context.source,
                        amount: recipient.amount
                    });
                }
                return AbilityDsl.actions.placeFateOnRing({
                    amount: recipient.amount,
                    target: recipient.ring
                });
            })
        );
    }
}
