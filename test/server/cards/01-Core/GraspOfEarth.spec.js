describe('Grasp of Earth', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    fate: 5,
                    inPlay: ['student-of-esoterica'],
                    hand: ['grasp-of-earth']
                }
            });

            this.student = this.player1.findCardByName('student-of-esoterica');
            this.grasp = this.player1.findCardByName('grasp-of-earth');
        });

        it('can be attached to a Shugenja you control for 1 fate', function () {
            this.player1.playAttachment(this.grasp, this.student);
            expect(this.grasp.parent).toBe(this.student);
            expect(this.player1.fate).toBe(4);
        });
    });
});

describe('Grasp of Earth and characters played as attachments', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['student-of-esoterica'],
                    hand: ['grasp-of-earth']
                },
                player2: {
                    inPlay: ['togashi-initiate'],
                    hand: ['tattooed-wanderer']
                }
            });
            this.student = this.player1.findCardByName('student-of-esoterica');
            this.grasp = this.player1.playAttachment('grasp-of-earth', this.student);
            this.initiate = this.player2.findCardByName('togashi-initiate');
            this.wanderer = this.player2.findCardByName('tattooed-wanderer');
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.student],
                defenders: [this.initiate]
            });
            this.player2.pass();
            this.player1.clickCard(this.grasp);
        });

        it('still lets the opponent play a character as an attachment (EmeraldDB ruling)', function () {
            // playing it as a character stays blocked, so the attachment play starts directly
            this.player2.clickCard(this.wanderer);
            expect(this.player2).toBeAbleToSelect(this.initiate);
            this.player2.clickCard(this.initiate);
            expect(this.wanderer.parent).toBe(this.initiate);
        });
    });
});

describe('Grasp of Earth and a later change of control', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    honor: 8,
                    inPlay: ['student-of-esoterica'],
                    hand: ['grasp-of-earth', 'blackmail'],
                    dynastyDiscard: ['favorable-ground']
                },
                player2: {
                    honor: 12,
                    inPlay: ['togashi-initiate']
                }
            });
            this.student = this.player1.findCardByName('student-of-esoterica');
            this.grasp = this.player1.findCardByName('grasp-of-earth');
            this.ground = this.player1.placeCardInProvince('favorable-ground', 'province 1');
            this.initiate = this.player2.findCardByName('togashi-initiate');
            this.player1.playAttachment(this.grasp, this.student);
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.student],
                defenders: []
            });
            this.player2.pass();
            this.player1.clickCard(this.grasp);
            this.player2.pass();
            this.player1.clickCard('blackmail');
            this.player1.clickCard(this.initiate);
            this.player2.pass();
        });

        it('stops only the characters the opponent controls now (EmeraldDB ruling)', function () {
            expect(this.initiate.controller).toBe(this.player1.player);
            this.player1.clickCard(this.ground);
            this.player1.clickCard(this.initiate);
            expect(this.initiate.isParticipating()).toBe(true);
        });
    });
});

describe('Grasp of Earth\'s attachment condition and timing', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['student-of-esoterica', 'doji-challenger'],
                    hand: ['grasp-of-earth']
                },
                player2: {
                    inPlay: ['agasha-swordsmith']
                }
            });
            this.student = this.player1.findCardByName('student-of-esoterica');
            this.challenger = this.player1.findCardByName('doji-challenger');
            this.grasp = this.player1.findCardByName('grasp-of-earth');
            this.swordsmith = this.player2.findCardByName('agasha-swordsmith');
        });

        it('can only be attached to a Shugenja character you control', function () {
            this.player1.clickCard(this.grasp);
            expect(this.player1).toHavePrompt('Grasp of Earth');
            expect(this.player1).toBeAbleToSelect(this.student);
            expect(this.player1).not.toBeAbleToSelect(this.challenger);
            expect(this.player1).not.toBeAbleToSelect(this.swordsmith);
        });

        it('cannot be used outside a conflict', function () {
            this.player1.playAttachment(this.grasp, this.student);
            this.player2.pass();
            expect(this.game.isDuringConflict()).toBe(false);
            this.player1.clickCard(this.grasp);
            expect(this.grasp.bowed).toBe(false);
            expect(this.player1).toHavePrompt('Action Window');
        });
    });
});

describe('Grasp of Earth during a conflict', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['student-of-esoterica'],
                    hand: ['grasp-of-earth']
                },
                player2: {
                    fate: 5,
                    inPlay: ['togashi-initiate', 'border-rider', 'kakita-asami'],
                    hand: ['protected-merchant', 'a-cleansing-death'],
                    dynastyDiscard: ['favorable-ground', 'doji-whisperer']
                }
            });
            this.student = this.player1.findCardByName('student-of-esoterica');
            this.grasp = this.player1.findCardByName('grasp-of-earth');
            this.initiate = this.player2.findCardByName('togashi-initiate');
            this.borderRider = this.player2.findCardByName('border-rider');
            this.asami = this.player2.findCardByName('kakita-asami');
            this.merchant = this.player2.findCardByName('protected-merchant');
            this.cleansingDeath = this.player2.findCardByName('a-cleansing-death');
            this.whisperer = this.player2.placeCardInProvince('doji-whisperer', 'province 1');
            this.whisperer.facedown = false;
            this.ground = this.player2.placeCardInProvince('favorable-ground', 'province 2');
            this.ground.facedown = false;
            this.player1.playAttachment(this.grasp, this.student);
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.student],
                defenders: [this.initiate]
            });
            this.player2.pass();
            this.player1.clickCard(this.grasp);
            expect(this.grasp.bowed).toBe(true);
        });

        it('stops the opponent\'s characters from moving to the conflict', function () {
            this.player2.clickCard(this.ground);
            expect(this.player2).toHavePrompt('Favorable Ground');
            expect(this.player2).toBeAbleToSelect(this.initiate);
            expect(this.player2).not.toBeAbleToSelect(this.borderRider);
            expect(this.player2).not.toBeAbleToSelect(this.asami);
        });

        it('stops the opponent from playing a character from hand', function () {
            this.player2.clickCard(this.merchant);
            expect(this.merchant.location).toBe('hand');
            expect(this.player2.fate).toBe(5);
            expect(this.player2).toHavePrompt('Conflict Action Window');
        });

        it('stops a character the opponent puts into play afterwards from moving to the conflict (ruling #947)', function () {
            this.player2.clickCard(this.cleansingDeath);
            this.player2.clickCard(this.asami);
            this.player2.clickCard(this.whisperer);
            expect(this.whisperer.location).toBe('play area');
            expect(this.asami.location).toBe('dynasty discard pile');
            this.player1.pass();
            this.player2.clickCard(this.ground);
            expect(this.player2).toHavePrompt('Favorable Ground');
            expect(this.player2).toBeAbleToSelect(this.initiate);
            expect(this.player2).not.toBeAbleToSelect(this.whisperer);
        });
    });
});
