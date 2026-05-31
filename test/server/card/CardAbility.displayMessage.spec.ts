import CardAbility from '../../../server/game/CardAbility.js';
import { GameChat } from '../../../server/game/GameChat.js';
import AbilityDsl from '../../../server/game/abilitydsl.js';

interface DisplayMessageTestContext {
    gameSpy: any;
    player: any;
    opponent?: any;
    cardSpy: any;
    courtier: any;
    eventToCancel: any;
    target: any;
    ability: CardAbility;
    actionSpy: jasmine.Spy;
    args: any[];
}

describe('CardAbility displayMessage', function () {
    beforeEach(function (this: DisplayMessageTestContext) {
        this.gameSpy = jasmine.createSpyObj('game', ['addMessage', 'on']);
        this.gameSpy.gameChat = new GameChat();
        this.player = {
            name: 'Player 1',
            getShortSummary: () => this.player,
            isFacedown: () => false,
            getEffects: () => [],
            honorGained: () => 0
        };
        this.cardSpy = jasmine.createSpyObj('card', ['getType', 'getShortSummary', 'isFacedown']);
        this.cardSpy.game = this.gameSpy;
        this.cardSpy.type = 'event';
        this.cardSpy.getShortSummary.and.returnValue(this.cardSpy);
        this.cardSpy.isFacedown.and.returnValue(false);
    });

    describe('Assassinaton', function () {
        beforeEach(function (this: DisplayMessageTestContext) {
            this.ability = new CardAbility(this.cardSpy, {
                cost: AbilityDsl.costs.payHonor(3),
                target: {
                    cardType: 'character',
                    cardCondition: (card: any) => card.getCost() <= 2,
                    gameAction: AbilityDsl.actions.discardFromPlay()
                }
            } as any);
            this.actionSpy = spyOn(
                (this.ability.targets[0] as any).properties.gameAction[0],
                'canAffect'
            );
            this.actionSpy.and.returnValue('true');
            this.target = { name: 'target', getShortSummary: () => this.target };
            this.ability.displayMessage({
                game: this.gameSpy,
                player: this.player,
                source: this.cardSpy,
                costs: {
                    loseHonor: this.player
                },
                targets: {
                    target: this.target
                },
                target: this.target,
                gameActionsResolutionChain: []
            } as any);
            this.args = this.gameSpy.addMessage.calls.allArgs()[0];
        });

        it('should send an 8 part message', function (this: DisplayMessageTestContext) {
            expect(this.args[0]).toBe('{0}{1}{2}{3}{4}{5}{6}{7}{8}');
        });

        it('should have the player object as the first arg', function (this: DisplayMessageTestContext) {
            expect(this.args[1]).toBe(this.player);
        });

        it('should have \'plays\' as the second arg', function (this: DisplayMessageTestContext) {
            expect(this.args[2]).toBe(' plays ');
        });

        it('should have the source as the third arg', function (this: DisplayMessageTestContext) {
            expect(this.args[3]).toBe(this.cardSpy);
        });

        it('should have a comma as the sixth arg', function (this: DisplayMessageTestContext) {
            expect(this.args[6]).toBe(', ');
        });

        it('should have a cost term as the seventh arg', function (this: DisplayMessageTestContext) {
            expect(this.args[7][0].message[0]).toBe('losing');
            expect(this.args[7][0].message[1]).toBe(' ');
            expect(this.args[7][0].message[2]).toBe(3);
            expect(this.args[7][0].message[3]).toBe(' ');
            expect(this.args[7][0].message[4]).toBe('honor');
        });

        it('should have \'to\' as the eighth arg', function (this: DisplayMessageTestContext) {
            expect(this.args[8]).toBe(' to ');
        });

        it('should have an effect term as the ninth arg', function (this: DisplayMessageTestContext) {
            expect(this.args[9].message[0]).toBe('discard');
            expect(this.args[9].message[1]).toBe(' ');
            expect(this.args[9].message[2]).toBe(this.target);
        });
    });

    describe('Forged Edict', function () {
        beforeEach(function (this: DisplayMessageTestContext) {
            this.courtier = { name: 'courtier', getShortSummary: () => this.courtier, isFacedown: () => false };
            this.eventToCancel = {
                name: 'eventToCancel',
                getShortSummary: () => this.eventToCancel,
                isFacedown: () => false
            };
            this.ability = new CardAbility(this.cardSpy, {
                cost: AbilityDsl.costs.dishonor({ cardCondition: (card: any) => card.hasTrait('courtier') }),
                effect: 'cancel {1}',
                effectArgs: (context: any) => context.event.card,
                handler: (context: any) => context.cancel()
            } as any);
            this.ability.displayMessage({
                game: this.gameSpy,
                player: this.player,
                source: this.cardSpy,
                costs: {
                    dishonor: this.courtier
                },
                event: {
                    card: this.eventToCancel
                },
                gameActionsResolutionChain: []
            } as any);
            this.args = this.gameSpy.addMessage.calls.allArgs()[0];
        });

        it('should send an 8 part message', function (this: DisplayMessageTestContext) {
            expect(this.args[0]).toBe('{0}{1}{2}{3}{4}{5}{6}{7}{8}');
        });

        it('should have the player object as the first arg', function (this: DisplayMessageTestContext) {
            expect(this.args[1]).toBe(this.player);
        });

        it('should have \'plays\' as the second arg', function (this: DisplayMessageTestContext) {
            expect(this.args[2]).toBe(' plays ');
        });

        it('should have the source as the third arg', function (this: DisplayMessageTestContext) {
            expect(this.args[3]).toBe(this.cardSpy);
        });

        it('should have a comma as the sixth arg', function (this: DisplayMessageTestContext) {
            expect(this.args[6]).toBe(', ');
        });

        it('should have a cost term as the seventh arg', function (this: DisplayMessageTestContext) {
            expect(this.args[7][0].message[0]).toBe('dishonoring');
            expect(this.args[7][0].message[1]).toBe(' ');
            expect(this.args[7][0].message[2]).toBe(this.courtier);
        });

        it('should have \'to\' as the eighth arg', function (this: DisplayMessageTestContext) {
            expect(this.args[8]).toBe(' to ');
        });

        it('should have an effect term as the ninth arg', function (this: DisplayMessageTestContext) {
            expect(this.args[9].message[0]).toBe('cancel');
            expect(this.args[9].message[1]).toBe(' ');
            expect(this.args[9].message[2]).toBe(this.eventToCancel);
        });
    });

    describe('City of the Open Hand', function () {
        beforeEach(function (this: DisplayMessageTestContext) {
            class PlayerStub {
                name: string;
                type: string;
                opponent?: PlayerStub;
                constructor(name: string) {
                    this.name = name;
                    this.type = 'player';
                }
                checkRestrictions(): boolean {
                    return true;
                }
                getShortSummary(): this {
                    return this;
                }
                isFacedown(): boolean {
                    return false;
                }
                getEffects(): unknown[] {
                    return [];
                }
                honorGained(): number {
                    return 0;
                }
            }
            this.opponent = new PlayerStub('Player 2');
            this.opponent.opponent = this.player;
            this.player.opponent = this.opponent;
            this.cardSpy.type = 'stronghold';
            this.ability = new CardAbility(this.cardSpy, {
                cost: AbilityDsl.costs.bowSelf(),
                gameAction: AbilityDsl.actions.takeHonor()
            } as any);
            this.ability.displayMessage({
                game: this.gameSpy,
                player: this.player,
                source: this.cardSpy,
                costs: {
                    bow: this.cardSpy
                },
                gameActionsResolutionChain: []
            } as any);
            this.args = this.gameSpy.addMessage.calls.allArgs()[0];
        });

        it('should send an 8 part message', function (this: DisplayMessageTestContext) {
            expect(this.args[0]).toBe('{0}{1}{2}{3}{4}{5}{6}{7}{8}');
        });

        it('should have the player object as the first arg', function (this: DisplayMessageTestContext) {
            expect(this.args[1]).toBe(this.player);
        });

        it('should have \'uses\' as the second arg', function (this: DisplayMessageTestContext) {
            expect(this.args[2]).toBe(' uses ');
        });

        it('should have the source as the third arg', function (this: DisplayMessageTestContext) {
            expect(this.args[3]).toBe(this.cardSpy);
        });

        it('should have a comma as the sixth arg', function (this: DisplayMessageTestContext) {
            expect(this.args[6]).toBe(', ');
        });

        it('should have a cost term as the seventh arg', function (this: DisplayMessageTestContext) {
            expect(this.args[7][0].message[0]).toBe('bowing');
            expect(this.args[7][0].message[1]).toBe(' ');
            expect(this.args[7][0].message[2]).toBe(this.cardSpy);
        });

        it('should have \'to\' as the eighth arg', function (this: DisplayMessageTestContext) {
            expect(this.args[8]).toBe(' to ');
        });

        it('should have an effect term as the ninth arg', function (this: DisplayMessageTestContext) {
            expect(this.args[9].message[0]).toBe('take');
            expect(this.args[9].message[1]).toBe(' ');
            expect(this.args[9].message[2]).toBe(1);
            expect(this.args[9].message[3]).toBe(' ');
            expect(this.args[9].message[4]).toBe('honor');
            expect(this.args[9].message[5]).toBe(' ');
            expect(this.args[9].message[6]).toBe('from');
            expect(this.args[9].message[7]).toBe(' ');
            expect(this.args[9].message[8]).toBe(this.opponent);
        });
    });
});
