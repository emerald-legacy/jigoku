describe('Capture the False Eye', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['akodo-toturi'],
                    hand: ['capture-the-false-eye', 'a-perfect-cut']
                },
                player2: {
                    inPlay: ['doji-kuwanan']
                }
            });

            this.toturi = this.player1.findCardByName('akodo-toturi');
            this.captureTheFalseEye = this.player1.findCardByName('capture-the-false-eye');
            this.perfectCut = this.player1.findCardByName('a-perfect-cut');

            this.kuwanan = this.player2.findCardByName('doji-kuwanan');
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.toturi],
                defenders: [this.kuwanan]
            });
            this.player2.pass();
        });

        it('bows the target and makes other events expensive', function () {
            const initialFate = this.player1.fate;

            this.player1.clickCard(this.captureTheFalseEye);
            this.player1.clickCard(this.kuwanan);

            expect(this.kuwanan.bowed).toBe(true);
            expect(this.getChatLogs(5)).toContain(
                'player1 plays Capture the False Eye to bow Doji Kuwanan. For this conflict, player1\'s events cost 1 more fate - did player1 walk into a trap?'
            );
            expect(this.player1.fate).toBe(initialFate - 1);

            this.player2.pass();
            this.player1.clickCard(this.perfectCut);
            this.player1.clickCard(this.toturi);
            expect(this.player1.fate).toBe(initialFate - 2);
        });
    });
});

describe('Capture the False Eye and events from the discard pile', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['akodo-toturi', 'matsu-berserker'],
                    hand: ['capture-the-false-eye'],
                    conflictDiscard: ['chain-of-command']
                },
                player2: {
                    inPlay: ['doji-kuwanan']
                }
            });
            this.toturi = this.player1.findCardByName('akodo-toturi');
            this.berserker = this.player1.findCardByName('matsu-berserker');
            this.capture = this.player1.findCardByName('capture-the-false-eye');
            this.chain = this.player1.findCardByName('chain-of-command');
            this.kuwanan = this.player2.findCardByName('doji-kuwanan');
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.toturi, this.berserker],
                defenders: [this.kuwanan]
            });
        });

        it('only makes events in your hand more expensive', function () {
            this.player2.pass();
            this.player1.clickCard(this.capture);
            this.player1.clickCard(this.kuwanan);
            expect(this.kuwanan.bowed).toBe(true);
            this.player2.pass();
            this.toturi.bowed = true;
            const fate = this.player1.fate;
            this.player1.clickCard(this.chain);
            this.player1.clickCard(this.toturi);
            this.player1.clickCard(this.berserker);
            expect(this.toturi.bowed).toBe(false);
            expect(this.player1.fate).toBe(fate);
        });
    });
});

describe('Capture the False Eye and bowed characters', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['matsu-berserker'],
                    hand: ['capture-the-false-eye']
                },
                player2: {
                    inPlay: ['doji-whisperer', 'kakita-yoshi']
                }
            });
            this.berserker = this.player1.findCardByName('matsu-berserker');
            this.whisperer = this.player2.findCardByName('doji-whisperer');
            this.yoshi = this.player2.findCardByName('kakita-yoshi');
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.berserker],
                defenders: [this.whisperer, this.yoshi]
            });
            this.whisperer.bowed = true;
            this.player2.pass();
        });

        it('can\'t choose a character that is already bowed (RRG Target)', function () {
            this.player1.clickCard('capture-the-false-eye');
            expect(this.player1).not.toBeAbleToSelect(this.whisperer);
            expect(this.player1).toBeAbleToSelect(this.yoshi);
        });
    });
});
