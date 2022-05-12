module Stimulus
  class DelegatorWithClosure
    def initialize(delegate, &closure)
      @delegate = delegate
      @closure = closure
    end

    ruby2_keywords def method_missing(*arguments, &block)
      if block.present? && block.arity == 1
        @delegate.public_send(*arguments) { block.yield_self(&@closure) }
      else
        @delegate.public_send(*arguments, &block)
      end
    end

    ruby2_keywords def respond_to_missing?(*arguments)
      @delegate.respond_to_missing?(*arguments)
    end
  end
end
