import AbilityDsl from '../../../abilitydsl.js';
import { CardType, EventName, Location, Players, PlayType } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import type Player from '../../../Player.js';
import type { EventPayload } from '../../../Events/EventPayloads.js';

export default class TogashiTsurumi extends DrawCard {
    static id = 'togashi-tsurumi';

    public setupCardAbilities() {
        this.persistentEffect({
            effect: AbilityDsl.effects.modifyBothSkills(() => this.getSkillBonus())
        });

        this.persistentEffect({
            location: Location.PlayArea,
            targetLocation: this.uuid,
            targetController: Players.Self,
            match: (card: DrawCard) => card.location === this.uuid && card.hasTrait('kiho'),
            effect: [
                AbilityDsl.effects.canPlayFromOutOfPlay(
                    (player: Player) => player === this.controller,
                    PlayType.PlayFromHand
                ),
                AbilityDsl.effects.registerToPlayFromOutOfPlay()
            ]
        });

        this.action('Place a card underneath self')
            .target('target', {
                activePromptTitle: 'Choose a card',
                location: Location.Hand,
                controller: Players.Self,
                cardType: [CardType.Event, CardType.Attachment, CardType.Character]
            }, AbilityDsl.actions.multiple([
                AbilityDsl.actions.draw((context) => ({
                    target: context.player,
                    amount: 1
                })),
                AbilityDsl.actions.handler({
                    handler: (context) => {
                        const card = context.target;
                        if(!(card instanceof DrawCard)) {
                            return;
                        }
                        context.player.moveCard(card, this.uuid);
                        card.controller = context.source.controller;
                        card.facedown = false;
                        card.lastingEffect(() => ({
                            until: {
                                onCardMoved: (event: EventPayload<EventName.OnCardMoved>) =>
                                    event.card === card && event.originalLocation === this.uuid
                            },
                            match: card,
                            effect: [AbilityDsl.effects.hideWhenFaceUp()]
                        }));
                    }
                })
            ]))
            .effect('place a card from their hand beneath {1} and draw a card', (context) => [context.source]);
    }

    private getSkillBonus() {
        return (this.game.allCards).reduce(
            (total, card) => (card.controller === this.controller && card.location === this.uuid ? total + 1 : total),
            0
        );
    }
}
