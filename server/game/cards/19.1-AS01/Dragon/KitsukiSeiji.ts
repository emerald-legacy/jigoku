import { msg } from '../../../GameChat.js';
import { modifyMilitarySkill, modifyPoliticalSkill } from '../../../effects.js';
import { joint, noAction, placeFate, placeFateOnRing } from '../../../GameActions/GameActions.js';
import { Element, EventName } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import type BaseCard from '../../../BaseCard.js';
import type { GameEvent } from '../../../Events/EventPayloads.js';
import type Player from '../../../Player.js';
import Ring from '../../../Ring.js';

const ELEMENT_KEY = 'kitsuki-seiji-water';

export default class KitsukiSeiji extends DrawCard {
    static id = 'kitsuki-seiji';

    public setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.player.showBid % 2 === 1,
            effect: [modifyMilitarySkill(+2), modifyPoliticalSkill(-2)]
        });
        this.persistentEffect({
            condition: (context) => context.player.showBid % 2 === 0,
            effect: [modifyMilitarySkill(-2), modifyPoliticalSkill(+2)]
        });

        this.wouldInterrupt('Put fate on this character')
            .when({
                onMoveFate: (event) => this.fateRecipientIsSeijisRing(event.recipient),
                onPlaceFateOnUnclaimedRings: (event) =>
                    event.recipients.some((recipient) => this.fateRecipientIsSeijisRing(recipient.ring))
            })
            .cancel((context) => {
                const event = context.event;
                switch(event.name) {
                    case EventName.OnPlaceFateOnUnclaimedRings:
                        return { replacementGameAction: this.replacementForPlaceFateOnUnclaimedRings(event, context.source) };
                    case EventName.OnMoveFate:
                        return { replacementGameAction: this.replacementForMoveFate(event, context.source) };
                    default:
                        return { replacementGameAction: noAction() };
                }
            })
            .chatText((context) => msg`put the fate that would go on the ${this.getCurrentElementSymbol(ELEMENT_KEY)} ring on ${context.chatTarget()} instead`);
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

    private replacementForMoveFate(event: GameEvent<EventName.OnMoveFate>, source: BaseCard) {
        return placeFate({
            origin: event.origin,
            target: source,
            amount: event.fate
        });
    }

    private replacementForPlaceFateOnUnclaimedRings(event: GameEvent<EventName.OnPlaceFateOnUnclaimedRings>, source: BaseCard) {
        return joint(
            event.recipients.map((recipient) => {
                const isSeijisRing = recipient.ring.hasElement(this.getCurrentElementSymbol(ELEMENT_KEY));
                if(isSeijisRing) {
                    return placeFate({
                        target: source,
                        amount: recipient.amount
                    });
                }
                return placeFateOnRing({
                    amount: recipient.amount,
                    target: recipient.ring
                });
            })
        );
    }
}
