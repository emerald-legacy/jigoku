describe('Niten Master', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['niten-master'],
                    hand: ['fine-katana', 'ancestral-daisho', 'ancestral-daisho']
                },
                player2: {
                    hand: ['fine-katana']
                }
            });
            this.nitenMaster = this.player1.findCardByName('niten-master');
            this.nitenMaster.bowed = true;
        });

        describe('attaching a weapon', function() {
            it('should allow Niten Master to be readied', function() {
                this.fineKatana = this.player1.clickCard('fine-katana');
                this.player1.clickCard(this.nitenMaster);
                expect(this.fineKatana.location).toBe('play area');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                this.player1.clickCard(this.nitenMaster);
                expect(this.nitenMaster.bowed).toBe(false);
            });
        });

        describe('an opponent attaching a weapon', function() {
            it('should not trigger Niten Master\'s reaction', function() {
                this.player1.clickPrompt('Pass');
                this.oppKatana = this.player2.playAttachment('fine-katana', this.nitenMaster);
                expect(this.oppKatana.location).toBe('play area');
                expect(this.player1).toHavePrompt('Action Window');
                expect(this.nitenMaster.bowed).toBe(true);
            });
        });
    });
});

describe('Niten Master\'s limit and moved weapons', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    fate: 5,
                    inPlay: ['niten-master', 'giver-of-gifts', 'doji-whisperer'],
                    hand: ['fine-katana', 'sharpened-tsuruhashi', 'sharpened-tsuruhashi']
                }
            });
            this.nitenMaster = this.player1.findCardByName('niten-master');
            this.giver = this.player1.findCardByName('giver-of-gifts');
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.katana = this.player1.findCardByName('fine-katana');
            [this.tsuruhashi1, this.tsuruhashi2] = this.player1.filterCardsByName('sharpened-tsuruhashi', 'hand');
            this.nitenMaster.bowed = true;
        });

        it('can be triggered only twice per round', function() {
            this.player1.playAttachment(this.katana, this.nitenMaster);
            this.player1.clickCard(this.nitenMaster);
            expect(this.nitenMaster.bowed).toBe(false);
            this.nitenMaster.bowed = true;
            this.player2.pass();
            this.player1.playAttachment(this.tsuruhashi1, this.nitenMaster);
            this.player1.clickCard(this.nitenMaster);
            expect(this.nitenMaster.bowed).toBe(false);
            this.nitenMaster.bowed = true;
            this.player2.pass();
            this.player1.playAttachment(this.tsuruhashi2, this.nitenMaster);
            expect(this.tsuruhashi2.parent).toBe(this.nitenMaster);
            expect(this.player1).not.toHavePrompt('Triggered Abilities');
            expect(this.player2).toHavePrompt('Action Window');
            expect(this.nitenMaster.bowed).toBe(true);
        });

        it('triggers when a Weapon is moved onto him (ruling #78)', function() {
            this.player1.playAttachment(this.katana, this.whisperer);
            this.player2.pass();
            this.player1.clickCard(this.giver);
            this.player1.clickCard(this.katana);
            this.player1.clickCard(this.nitenMaster);
            expect(this.katana.parent).toBe(this.nitenMaster);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.nitenMaster);
            this.player1.clickCard(this.nitenMaster);
            expect(this.nitenMaster.bowed).toBe(false);
        });
    });
});
